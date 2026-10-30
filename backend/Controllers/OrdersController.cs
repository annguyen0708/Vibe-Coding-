using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // POST /api/orders
        [HttpPost("api/orders")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            int userId = 2;
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (int.TryParse(userIdClaim, out int parsedId))
            {
                userId = parsedId;
            }
            else
            {
                var defaultCustomer = await _context.Users.FirstOrDefaultAsync(u => u.Role == "Customer");
                if (defaultCustomer != null) userId = defaultCustomer.Id;
            }

            if (dto.Items == null || !dto.Items.Any())
                return BadRequest(new { message = "Giỏ hàng trống." });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                decimal total = 0;
                var orderItems = new List<OrderItem>();

                foreach (var item in dto.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null)
                        return BadRequest(new { message = $"Sản phẩm ID {item.ProductId} không tồn tại." });

                    if (product.StockQuantity < item.Quantity)
                        return BadRequest(new { message = $"Sản phẩm '{product.Name}' không đủ hàng (còn {product.StockQuantity})." });

                    product.StockQuantity -= item.Quantity;
                    total += product.Price * item.Quantity;

                    orderItems.Add(new OrderItem
                    {
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    });
                }

                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = total,
                    Status = "Pending",
                    OrderItems = orderItems
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Đặt hàng thành công!", orderId = order.Id, totalAmount = total });
            }
            catch
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Có lỗi xảy ra khi xử lý đơn hàng." });
            }
        }

        // GET /api/orders/my-orders
        [HttpGet("api/orders/my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.TotalAmount,
                    o.Status,
                    items = o.OrderItems.Select(oi => new
                    {
                        oi.Id,
                        oi.ProductId,
                        productName = oi.Product != null ? oi.Product.Name : "",
                        productImage = oi.Product != null ? oi.Product.ImageUrl : "",
                        oi.Quantity,
                        oi.UnitPrice
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        // GET /api/admin/orders (Admin only)
        [HttpGet("api/admin/orders")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.TotalAmount,
                    o.Status,
                    userName = o.User != null ? o.User.FullName : "",
                    userEmail = o.User != null ? o.User.Email : "",
                    items = o.OrderItems.Select(oi => new
                    {
                        oi.Id,
                        oi.ProductId,
                        productName = oi.Product != null ? oi.Product.Name : "",
                        oi.Quantity,
                        oi.UnitPrice
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        // PUT /api/admin/orders/{id}/status (Admin only)
        [HttpPut("api/admin/orders/{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Đơn hàng không tồn tại." });

            var validStatuses = new[] { "Pending", "Processing", "Completed" };
            if (!validStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Trạng thái không hợp lệ." });

            order.Status = dto.Status;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật trạng thái thành công.", order });
        }

        // GET /api/admin/stats (Admin only)
        [HttpGet("api/admin/stats")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetStats()
        {
            var totalRevenue = await _context.Orders
                .Where(o => o.Status == "Completed")
                .SumAsync(o => o.TotalAmount);

            var totalOrders = await _context.Orders.CountAsync();
            var totalCustomers = await _context.Users.CountAsync(u => u.Role == "Customer");
            var pendingOrders = await _context.Orders.CountAsync(o => o.Status == "Pending");

            return Ok(new
            {
                totalRevenue,
                totalOrders,
                totalCustomers,
                pendingOrders
            });
        }
    }

    public class CreateOrderDto
    {
        public List<OrderItemDto>? Items { get; set; }
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateStatusDto
    {
        [System.ComponentModel.DataAnnotations.Required]
        public string Status { get; set; } = string.Empty;
    }
}

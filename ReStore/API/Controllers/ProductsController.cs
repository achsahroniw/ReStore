using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly StoreContext _context;
        public ProductsController(StoreContext context)
        {
            _context = context;

        }

        [HttpGet("getAllProducts")]
        public async Task<ActionResult<List<Product>>> GetAllProducts()
        {
            return await _context.Products.ToListAsync();
        }

        [HttpGet("getProductByID/{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            return await _context.Products.FindAsync(id);
        }
    }
}
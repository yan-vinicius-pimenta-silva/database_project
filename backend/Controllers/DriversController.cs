using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("drivers")]
public class DriversController : ControllerBase
{
    private readonly AppDb _db;
    public DriversController(AppDb db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Driver>>> GetAll()
        => await _db.Drivers.ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Driver>> Get(int id)
    {
        var driver = await _db.Drivers.FindAsync(id);
        return driver is null ? NotFound() : driver;
    }

    [HttpPost]
    public async Task<ActionResult<Driver>> Create(Driver d)
    {
        _db.Drivers.Add(d);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = d.Id }, d);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Driver d)
    {
        if (id != d.Id) return BadRequest();
        _db.Entry(d).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var driver = await _db.Drivers.FindAsync(id);
        if (driver is null) return NotFound();
        _db.Drivers.Remove(driver);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

namespace backend.Models;

public class Driver
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string CPF { get; set; } = "";
    public string CNHNumber { get; set; } = "";
    public string CNHCategory { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Status { get; set; } = "Active"; // Active, Inactive
}

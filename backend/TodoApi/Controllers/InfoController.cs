using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class InfoController : ControllerBase
{
    private readonly IConfiguration _config;

    public InfoController(IConfiguration config)
    {
        _config = config;
    }

    [HttpGet("version")]
    public IActionResult GetVersion()
    {
        var version = _config["Api:Version"];
        return Ok(new { version });
    }
}
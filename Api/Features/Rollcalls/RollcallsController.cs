using Api.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Rollcalls;

[Authorize]
[ApiController]
[Route("api/rollcalls")]
public class RollcallsController(IRollcallService _rollcallService) : CustomBaseController
{
  [HttpGet]
  public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
  {
    var result = await _rollcallService.GetAllAsync(
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("previews")]
  public async Task<IActionResult> GetPreviews(CancellationToken cancellationToken)
  {
    var result = await _rollcallService.GetPreviewsAsync(
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("template/{groupId:guid}")]
  public async Task<IActionResult> GetTemplate(
    Guid groupId,
    CancellationToken cancellationToken)
  {
    var result = await _rollcallService.GetRollcallTemplateAsync(
      groupId: groupId,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("{id:guid}")]
  public async Task<IActionResult> GetById(
    Guid id,
    CancellationToken cancellationToken)
  {
    var result = await _rollcallService.GetByIdAsync(
      id: id,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost]
  public async Task<IActionResult> Add(
    [FromBody] CreateRollcallRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _rollcallService.AddAsync(
      request: request,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut]
  public async Task<IActionResult> Update(
    [FromBody] UpdateRollcallRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _rollcallService.UpdateAsync(
      request: request,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpDelete("{id:guid}")]
  public async Task<IActionResult> Delete(
    Guid id,
    CancellationToken cancellationToken)
  {
    var result = await _rollcallService.RemoveAsync(
      id: id,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
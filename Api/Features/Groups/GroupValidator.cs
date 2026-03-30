using FluentValidation;

namespace Api.Features.Groups;

public class CreateGroupRequestValidator : AbstractValidator<CreateGroupRequest>
{
  public CreateGroupRequestValidator()
  {
    RuleFor(g => g.Name)
      .NotEmpty().WithMessage("Grup adı boş olamaz.")
      .MaximumLength(150).WithMessage("Grup adı en fazla 150 karakter olabilir.");

    RuleFor(g => g.Description)
      .MaximumLength(1000).WithMessage("Açıklama en fazla 1000 karakter olabilir.");

    RuleFor(g => g.OrganizationId)
      .NotEmpty().WithMessage("Grubun bir organizasyona ait olması gerekir.");
  }
}

public class UpdateGroupRequestValidator : AbstractValidator<UpdateGroupRequest>
{
  public UpdateGroupRequestValidator()
  {
    RuleFor(g => g.Id)
      .NotEmpty().WithMessage("Güncellenecek grup ID'si gereklidir.");

    RuleFor(g => g.Name)
      .NotEmpty().WithMessage("Grup adı boş olamaz.")
      .MaximumLength(150).WithMessage("Grup adı en fazla 150 karakter olabilir.");

    RuleFor(g => g.Description)
      .MaximumLength(1000).WithMessage("Açıklama en fazla 1000 karakter olabilir.");
  }
}
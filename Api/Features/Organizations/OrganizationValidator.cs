using FluentValidation;

namespace Api.Features.Organizations;

public class CreateOrganizationRequestValidator : AbstractValidator<CreateOrganizationRequest>
{
  public CreateOrganizationRequestValidator()
  {
    RuleFor(o => o.Name)
      .NotEmpty().WithMessage("Organizasyon adı boş olamaz.")
      .MaximumLength(150).WithMessage("Organizasyon adı en fazla 150 karakter olabilir.");

    RuleFor(o => o.Address)
      .MaximumLength(500).WithMessage("Adres en fazla 500 karakter olabilir.");

    RuleFor(o => o.LogoUrl)
      .MaximumLength(500).WithMessage("Logo URL'si en fazla 500 karakter olabilir.");
  }
}

public class UpdateOrganizationRequestValidator : AbstractValidator<UpdateOrganizationRequest>
{
  public UpdateOrganizationRequestValidator()
  {
    RuleFor(o => o.Id)
      .NotEmpty().WithMessage("Güncellenecek organizasyon ID'si gereklidir.");

    RuleFor(o => o.Name)
      .NotEmpty().WithMessage("Organizasyon adı boş olamaz.")
      .MaximumLength(150).WithMessage("Organizasyon adı en fazla 150 karakter olabilir.");

    RuleFor(o => o.Address)
      .MaximumLength(500).WithMessage("Adres en fazla 500 karakter olabilir.");

    RuleFor(o => o.LogoUrl)
      .MaximumLength(500).WithMessage("Logo URL'si en fazla 500 karakter olabilir.");
  }
}
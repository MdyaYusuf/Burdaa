using FluentValidation;

namespace Api.Features.Members;

public class CreateMemberRequestValidator : AbstractValidator<CreateMemberRequest>
{
  public CreateMemberRequestValidator()
  {
    RuleFor(m => m.FirstName)
      .NotEmpty().WithMessage("İsim boş olamaz.")
      .MaximumLength(50).WithMessage("İsim en fazla 50 karakter olabilir.");

    RuleFor(m => m.LastName)
      .NotEmpty().WithMessage("Soyisim boş olamaz.")
      .MaximumLength(50).WithMessage("Soyisim en fazla 50 karakter olabilir.");

    RuleFor(m => m.ExternalId)
      .MaximumLength(100).WithMessage("Harici ID en fazla 100 karakter olabilir.");

    RuleFor(m => m.BirthDate)
      .LessThan(m => DateTime.Now).WithMessage("Doğum tarihi bugünden büyük olamaz.");

    RuleFor(m => m.GroupId)
      .NotEmpty().WithMessage("Üyenin bir gruba atanması zorunludur.");
  }
}

public class UpdateMemberRequestValidator : AbstractValidator<UpdateMemberRequest>
{
  public UpdateMemberRequestValidator()
  {
    RuleFor(m => m.Id)
      .NotEmpty().WithMessage("Güncellenecek üye ID'si gereklidir.");

    RuleFor(m => m.FirstName)
      .NotEmpty().WithMessage("İsim boş olamaz.")
      .MaximumLength(50).WithMessage("İsim en fazla 50 karakter olabilir.");

    RuleFor(m => m.LastName)
      .NotEmpty().WithMessage("Soyisim boş olamaz.")
      .MaximumLength(50).WithMessage("Soyisim en fazla 50 karakter olabilir.");

    RuleFor(m => m.ExternalId)
      .MaximumLength(100).WithMessage("Harici ID en fazla 100 karakter olabilir.");

    RuleFor(m => m.BirthDate)
    .LessThan(DateTime.Now).WithMessage("Doğum tarihi bugünden büyük olamaz.");
  }
}
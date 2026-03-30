using FluentValidation;

namespace Api.Features.Rollcalls;

public class CreateRollcallRequestValidator : AbstractValidator<CreateRollcallRequest>
{
  public CreateRollcallRequestValidator()
  {
    RuleFor(r => r.Title)
      .NotEmpty().WithMessage("Yoklama başlığı boş olamaz.")
      .MaximumLength(150).WithMessage("Başlık en fazla 150 karakter olabilir.");

    RuleFor(r => r.Description)
      .MaximumLength(1000).WithMessage("Açıklama en fazla 1000 karakter olabilir.");

    RuleFor(r => r.Date)
      .NotEmpty().WithMessage("Yoklama tarihi gereklidir.");

    RuleFor(r => r.GroupId)
      .NotEmpty().WithMessage("Yoklamanın bir gruba ait olması gerekir.");

    RuleFor(r => r.Entries)
      .NotEmpty().WithMessage("En az bir üye için yoklama girişi yapılmalıdır.");

    RuleForEach(r => r.Entries).SetValidator(new CreateRollcallEntryDtoValidator());
  }
}

public class CreateRollcallEntryDtoValidator : AbstractValidator<CreateRollcallEntryDto>
{
  public CreateRollcallEntryDtoValidator()
  {
    RuleFor(e => e.MemberId)
      .NotEmpty().WithMessage("Üye seçimi zorunludur.");

    RuleFor(e => e.Note)
      .MaximumLength(500).WithMessage("Not en fazla 500 karakter olabilir.");
  }
}

public class UpdateRollcallRequestValidator : AbstractValidator<UpdateRollcallRequest>
{
  public UpdateRollcallRequestValidator()
  {
    RuleFor(r => r.Id)
      .NotEmpty().WithMessage("Güncellenecek yoklama ID'si gereklidir.");

    RuleFor(r => r.Title)
      .NotEmpty().WithMessage("Yoklama başlığı boş olamaz.")
      .MaximumLength(150).WithMessage("Başlık en fazla 150 karakter olabilir.");

    RuleFor(r => r.Description)
      .MaximumLength(1000).WithMessage("Açıklama en fazla 1000 karakter olabilir.");

    RuleFor(r => r.Date)
      .NotEmpty().WithMessage("Yoklama tarihi gereklidir.");

    RuleFor(r => r.Entries)
      .NotEmpty().WithMessage("Yoklama listesi boş olamaz.");

    RuleForEach(r => r.Entries).SetValidator(new UpdateRollcallEntryDtoValidator());
  }
}

public class UpdateRollcallEntryDtoValidator : AbstractValidator<UpdateRollcallEntryDto>
{
  public UpdateRollcallEntryDtoValidator()
  {
    RuleFor(e => e.MemberId)
      .NotEmpty().WithMessage("Üye seçimi zorunludur.");

    RuleFor(e => e.Note)
      .MaximumLength(500).WithMessage("Not en fazla 500 karakter olabilir.");
  }
}
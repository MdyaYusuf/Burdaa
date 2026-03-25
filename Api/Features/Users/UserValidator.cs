using FluentValidation;

namespace Api.Features.Users;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
  public LoginRequestValidator()
  {
    RuleFor(u => u.Email)
      .NotEmpty().WithMessage("E-posta adresi gereklidir.")
      .EmailAddress().WithMessage("Geçerli bir e-posta formatı giriniz.");

    RuleFor(u => u.Password)
      .NotEmpty().WithMessage("Şifre gereklidir.");
  }
}

public class RegisterUserRequestValidator : AbstractValidator<RegisterUserRequest>
{
  public RegisterUserRequestValidator()
  {
    RuleFor(u => u.Username)
      .NotEmpty().WithMessage("Kullanıcı adı boş olamaz.")
      .MinimumLength(3).WithMessage("Kullanıcı adı en az 3 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Kullanıcı adı en fazla 50 karakter olabilir.");

    RuleFor(u => u.Email)
      .NotEmpty().WithMessage("E-posta adresi boş olamaz.")
      .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");

    RuleFor(u => u.Password)
      .NotEmpty().WithMessage("Şifre boş olamaz.")
      .MinimumLength(8).WithMessage("Şifre en az 8 karakter olmalıdır.")
      .Matches(@"[A-Z]").WithMessage("Şifre en az bir büyük harf içermelidir.")
      .Matches(@"[a-z]").WithMessage("Şifre en az bir küçük harf içermelidir.")
      .Matches(@"[0-9]").WithMessage("Şifre en az bir rakam içermelidir.");
  }
}

public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
  public UpdateUserRequestValidator()
  {
    RuleFor(u => u.Username)
      .NotEmpty().WithMessage("Kullanıcı adı boş olamaz.")
      .MinimumLength(3).WithMessage("Kullanıcı adı en az 3 karakter olmalıdır.");

    RuleFor(u => u.Email)
      .NotEmpty().WithMessage("E-posta adresi boş olamaz.")
      .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");

    RuleFor(u => u.Bio)
      .MaximumLength(1000).WithMessage("Bio en fazla 1000 karakter olabilir.");
  }
}

public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
{
  public ChangePasswordRequestValidator()
  {
    RuleFor(u => u.CurrentPassword)
      .NotEmpty().WithMessage("Mevcut şifrenizi giriniz.");

    RuleFor(u => u.NewPassword)
      .NotEmpty().WithMessage("Yeni şifre boş olamaz.")
      .MinimumLength(8).WithMessage("Yeni şifre en az 8 karakter olmalıdır.")
      .Matches(@"[A-Z]").WithMessage("Yeni şifre en az bir büyük harf içermelidir.")
      .Matches(@"[a-z]").WithMessage("Yeni şifre en az bir küçük harf içermelidir.")
      .Matches(@"[0-9]").WithMessage("Yeni şifre en az bir rakam içermelidir.")
      .NotEqual(u => u.CurrentPassword).WithMessage("Yeni şifre mevcut şifre ile aynı olamaz.");

    RuleFor(u => u.ConfirmNewPassword)
      .Equal(u => u.NewPassword).WithMessage("Şifreler eşleşmiyor.");
  }
}
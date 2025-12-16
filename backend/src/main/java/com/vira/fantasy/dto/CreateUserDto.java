package com.vira.fantasy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateUserDto(
  @Email
  @NotBlank
  String username,

  @NotBlank
  String password
) {
}
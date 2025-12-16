package com.vira.fantasy.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vira.fantasy.dto.CreateUserDto;
import com.vira.fantasy.dto.LoginRequestDto;
import com.vira.fantasy.dto.TokenResponseDto;
import com.vira.fantasy.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody CreateUserDto payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(payload.username(), payload.password()));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@RequestBody LoginRequestDto payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new TokenResponseDto(authService.login(payload.username(), payload.password())));
    }
}
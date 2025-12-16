package com.vira.fantasy.security;

import java.util.UUID;

public record JwtUserPrincipal(
    UUID userId,
    String email
) {}
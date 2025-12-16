package com.vira.fantasy.security;

import java.util.Collections;

import org.springframework.security.authentication.AbstractAuthenticationToken;

public class JwtAuthenticationToken extends AbstractAuthenticationToken {

  private final JwtUserPrincipal principal;
  private final String token;

  public JwtAuthenticationToken(JwtUserPrincipal principal, String token) {
    super(Collections.emptyList());
    this.principal = principal;
    this.token = token;
    setAuthenticated(true);
  }

  @Override
  public Object getCredentials() {
    return token;
  }

  @Override
  public Object getPrincipal() {
    return principal;
  }
}
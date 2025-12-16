package com.vira.fantasy.mapper;

import org.mapstruct.Mapper;

import com.vira.fantasy.dto.UserResponseDto;
import com.vira.fantasy.entity.UserEntity;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponseDto toDto(UserEntity entity);

    UserEntity toEntity(UserResponseDto dto);
}

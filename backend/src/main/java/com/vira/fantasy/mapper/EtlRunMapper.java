package com.vira.fantasy.mapper;

import org.mapstruct.Mapper;

import com.vira.fantasy.dto.EtlRunResponseDto;
import com.vira.fantasy.entity.EtlRunEntity;

@Mapper(componentModel = "spring")
public interface EtlRunMapper {

    EtlRunResponseDto toDto(EtlRunEntity entity);

    EtlRunEntity toEntity(EtlRunResponseDto dto);
}

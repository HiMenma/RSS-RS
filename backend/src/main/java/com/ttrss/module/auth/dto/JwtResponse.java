package com.ttrss.module.auth.dto;

import com.ttrss.module.auth.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * JWT 响应 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {

    /**
     * Access Token
     */
    private String accessToken;

    /**
     * Refresh Token
     */
    private String refreshToken;

    /**
     * 用户 ID
     */
    private Integer userId;

    /**
     * 用户名
     */
    private String username;

    /**
     * 邮箱
     */
    private String email;

    /**
     * Access Token 过期时间（毫秒）
     */
    private Long expiresIn;

    /**
     * 从用户实体构建响应
     *
     * @param accessToken Access Token
     * @param refreshToken Refresh Token
     * @param user 用户实体
     * @param expiresIn Access Token 过期时间（毫秒）
     * @return JWT 响应
     */
    public static JwtResponse fromUser(String accessToken, String refreshToken, User user, Long expiresIn) {
        return JwtResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .username(user.getLogin())
                .email(user.getEmail())
                .expiresIn(expiresIn)
                .build();
    }

    /**
     * 从用户实体构建响应（使用默认过期时间）
     *
     * @param accessToken Access Token
     * @param refreshToken Refresh Token
     * @param user 用户实体
     * @return JWT 响应
     */
    public static JwtResponse fromUser(String accessToken, String refreshToken, User user) {
        return fromUser(accessToken, refreshToken, user, 900000L); // 默认 15 分钟
    }
}

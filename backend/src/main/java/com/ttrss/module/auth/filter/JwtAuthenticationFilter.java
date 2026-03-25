package com.ttrss.module.auth.filter;

import com.ttrss.module.auth.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * JWT 认证过滤器
 * 从请求头提取 JWT Token，验证并设置 SecurityContext
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /**
     * Authorization 请求头名称
     */
    private static final String AUTHORIZATION_HEADER = "Authorization";

    /**
     * Bearer Token 前缀
     */
    private static final String BEARER_PREFIX = "Bearer ";

    /**
     * 需要跳过 JWT 认证的路径后缀（认证端点本身不需要 Token）
     * 使用后缀匹配以处理 context-path（如 /api/auth/login）
     */
    private static final List<String> SKIP_PATH_SUFFIXES = List.of(
            "/auth/login",
            "/auth/register",
            "/auth/refresh",
            "/auth/logout"
    );

    private final JwtService jwtService;

    /**
     * 执行过滤器逻辑
     *
     * @param request HTTP 请求
     * @param response HTTP 响应
     * @param filterChain 过滤器链
     * @throws ServletException Servlet 异常
     * @throws IOException IO 异常
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // 跳过认证端点（使用后缀匹配以处理 context-path）
        String requestPath = request.getRequestURI();
        if (SKIP_PATH_SUFFIXES.stream().anyMatch(requestPath::endsWith)) {
            log.debug("跳过 JWT 认证：{}", requestPath);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 从请求头提取 JWT Token
            String jwt = extractJwtFromRequest(request);

            // 验证 Token 并设置 SecurityContext
            if (StringUtils.hasText(jwt)) {
                if (jwtService.validateToken(jwt)) {
                    Integer userId = jwtService.getUserIdFromToken(jwt);
                    String username = jwtService.getUsernameFromToken(jwt);

                    // 创建 User 对象（实现 UserDetails 接口）
                    User principal = new User(username, "", new ArrayList<>(List.of(new SimpleGrantedAuthority("ROLE_USER"))));

                    // 创建认证对象
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    principal,
                                    null,
                                    principal.getAuthorities()
                            );

                    // 设置认证详情
                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    // 设置到 SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    log.debug("用户认证成功：userId={}, username={}", userId, username);
                } else {
                    log.debug("Token 验证失败");
                }
            }
        } catch (Exception e) {
            log.error("JWT 认证过滤器异常：{}", e.getMessage());
            // 不抛出异常，让请求继续（由 AuthEntryPoint 处理未认证情况）
        }

        // 继续执行过滤器链
        filterChain.doFilter(request, response);
    }

    /**
     * 从请求头提取 JWT Token
     *
     * @param request HTTP 请求
     * @return JWT Token（不含前缀）
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }

        return null;
    }
}

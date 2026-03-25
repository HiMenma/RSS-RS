package com.ttrss.module.article.controller;

import com.ttrss.module.article.dto.ArticleDTO;
import com.ttrss.module.article.dto.ArticlePageResponse;
import com.ttrss.module.article.service.ArticleService;
import com.ttrss.module.auth.entity.User;
import com.ttrss.module.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 文章控制器
 * 处理文章列表查询请求
 */
@Slf4j
@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
@Tag(name = "文章管理", description = "RSS 文章相关 API")
public class ArticleController {

    private final ArticleService articleService;
    private final UserService userService;

    /**
     * 获取当前用户 ID
     *
     * @param userDetails 认证用户信息
     * @return 用户 ID
     */
    private Integer getCurrentUserId(UserDetails userDetails) {
        if (userDetails == null) {
            return null;
        }
        // 从 UserDetails 获取用户名，然后查询用户 ID
        String username = userDetails.getUsername();
        User user = userService.getUserByLogin(username);
        return user != null ? user.getId() : null;
    }

    /**
     * 获取文章列表
     *
     * @param userDetails 认证用户信息
     * @param feedId 订阅源 ID（可选）
     * @param categoryId 分类 ID（可选）
     * @param isRead 已读状态（可选，true=仅已读，false=仅未读）
     * @param isStarred 星标状态（可选，true=仅星标，false=仅非星标）
     * @param page 页码（从 1 开始，默认 1）
     * @param pageSize 每页大小（默认 20，最大 100）
     * @return 分页文章列表
     */
    @Operation(summary = "获取文章列表", description = "获取分页文章列表，支持多种筛选条件")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "获取成功"),
        @ApiResponse(responseCode = "401", description = "未认证")
    })
    @GetMapping
    public ResponseEntity<ArticlePageResponse> getArticles(
            @Parameter(description = "认证用户信息") @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "订阅源 ID（可选，支持特殊值：unread=未读）") @RequestParam(required = false) String feedId,
            @Parameter(description = "分类 ID（可选）") @RequestParam(required = false) Integer categoryId,
            @Parameter(description = "已读状态（可选）") @RequestParam(required = false) Boolean isRead,
            @Parameter(description = "星标状态（可选）") @RequestParam(required = false) Boolean isStarred,
            @Parameter(description = "页码（从 1 开始，默认 1）") @RequestParam(required = false, defaultValue = "1") Integer page,
            @Parameter(description = "每页大小（默认 20，最大 100）") @RequestParam(required = false, defaultValue = "20") Integer pageSize) {

        Integer userId = getCurrentUserId(userDetails);
        if (userId == null) {
            log.warn("获取文章列表失败：未认证用户");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("获取文章列表：userId={}, feedId={}, categoryId={}, isRead={}, isStarred={}, page={}, pageSize={}",
                userId, feedId, categoryId, isRead, isStarred, page, pageSize);

        try {
            // 转换参数：前端 isRead -> 后端 unread（取反），isStarred -> starred
            Boolean unread = isRead != null ? !isRead : null;
            // 处理特殊 feedId 值
            Integer actualFeedId = null;
            if (feedId != null && !"unread".equals(feedId) && !"all".equals(feedId)) {
                try {
                    actualFeedId = Integer.parseInt(feedId);
                } catch (NumberFormatException e) {
                    log.warn("无效的 feedId: {}", feedId);
                    return ResponseEntity.badRequest().build();
                }
            }
            // 如果 feedId 是 "unread"，则设置 unread=true
            if ("unread".equals(feedId)) {
                unread = true;
            }
            ArticlePageResponse response = articleService.getArticles(
                    userId, actualFeedId, categoryId, unread, isStarred, page, pageSize);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("获取文章列表失败：userId={}, error={}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 获取未读文章数量
     *
     * @param userDetails 认证用户信息
     * @return 未读文章数量
     */
    @Operation(summary = "获取未读文章数量", description = "获取当前用户的未读文章总数")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "获取成功"),
        @ApiResponse(responseCode = "401", description = "未认证")
    })
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(
            @Parameter(description = "认证用户信息") @AuthenticationPrincipal UserDetails userDetails) {
        Integer userId = getCurrentUserId(userDetails);
        if (userId == null) {
            log.warn("获取未读数量失败：未认证用户");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.debug("获取未读文章数量：userId={}", userId);
        Long count = articleService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    /**
     * 获取星标文章数量
     *
     * @param userDetails 认证用户信息
     * @return 星标文章数量
     */
    @Operation(summary = "获取星标文章数量", description = "获取当前用户的星标文章总数")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "获取成功"),
        @ApiResponse(responseCode = "401", description = "未认证")
    })
    @GetMapping("/starred/count")
    public ResponseEntity<Long> getStarredCount(
            @Parameter(description = "认证用户信息") @AuthenticationPrincipal UserDetails userDetails) {
        Integer userId = getCurrentUserId(userDetails);
        if (userId == null) {
            log.warn("获取星标数量失败：未认证用户");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.debug("获取星标文章数量：userId={}", userId);
        Long count = articleService.getStarredCount(userId);
        return ResponseEntity.ok(count);
    }

    /**
     * 获取文章详情
     *
     * @param userDetails 认证用户信息
     * @param intId 用户文章 ID
     * @return 文章详情 DTO
     */
    @Operation(summary = "获取文章详情", description = "根据 ID 获取文章详细信息")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "获取成功"),
        @ApiResponse(responseCode = "401", description = "未认证"),
        @ApiResponse(responseCode = "404", description = "文章不存在")
    })
    @GetMapping("/{intId}")
    public ResponseEntity<ArticleDTO> getArticle(
            @Parameter(description = "认证用户信息") @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "用户文章 ID") @PathVariable("intId") Integer intId) {

        Integer userId = getCurrentUserId(userDetails);
        if (userId == null) {
            log.warn("获取文章详情失败：未认证用户");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("获取文章详情：userId={}, intId={}", userId, intId);

        try {
            ArticleDTO article = articleService.getArticleById(intId, userId);
            if (article == null) {
                log.warn("文章不存在或无权限：userId={}, intId={}", userId, intId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(article);
        } catch (Exception e) {
            log.error("获取文章详情失败：userId={}, intId={}, error={}", userId, intId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 删除单篇文章
     *
     * @param userDetails 认证用户信息
     * @param intId 用户文章 ID
     * @return 操作结果
     */
    @Operation(summary = "删除文章", description = "删除指定的文章")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "删除成功"),
        @ApiResponse(responseCode = "401", description = "未认证"),
        @ApiResponse(responseCode = "404", description = "文章不存在")
    })
    @DeleteMapping("/{intId}")
    public ResponseEntity<Map<String, Object>> deleteArticle(
            @Parameter(description = "认证用户信息") @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "用户文章 ID") @PathVariable("intId") Integer intId) {

        Integer userId = getCurrentUserId(userDetails);
        if (userId == null) {
            log.warn("删除文章失败：未认证用户");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("删除文章：userId={}, intId={}", userId, intId);

        try {
            boolean success = articleService.deleteArticle(intId, userId);
            if (!success) {
                log.warn("删除文章失败：文章不存在或无权限：userId={}, intId={}", userId, intId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("删除文章失败：userId={}, intId={}, error={}", userId, intId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 批量删除文章
     *
     * @param userDetails 认证用户信息
     * @param body 请求体（包含 intIds 列表）
     * @return 成功删除的数量
     */
    @Operation(summary = "批量删除文章", description = "批量删除多篇文章")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "删除成功"),
        @ApiResponse(responseCode = "401", description = "未认证")
    })
    @DeleteMapping("/batch")
    public ResponseEntity<Integer> batchDeleteArticles(
            @Parameter(description = "认证用户信息") @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body) {

        Integer userId = getCurrentUserId(userDetails);
        if (userId == null) {
            log.warn("批量删除文章失败：未认证用户");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        @SuppressWarnings("unchecked")
        List<Integer> intIds = body != null ? (List<Integer>) body.get("intIds") : null;

        if (intIds == null || intIds.isEmpty()) {
            log.warn("批量删除文章失败：intIds 为空");
            return ResponseEntity.badRequest().build();
        }

        log.info("批量删除文章：userId={}, intIds={}", userId, intIds);

        try {
            int count = articleService.batchDeleteArticles(intIds, userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("批量删除文章失败：userId={}, error={}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 标记文章已读/未读
     *
     * @param userDetails 认证用户信息
     * @param intId 用户文章 ID
     * @param read 已读状态（true=已读，false=未读）
     * @return 操作结果
     */
    @Operation(summary = "标记文章已读/未读", description = "将文章标记为已读或未读状态")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "操作成功"),
        @ApiResponse(responseCode = "401", description = "未认证"),
        @ApiResponse(responseCode = "404", description = "文章不存在")
    })
    @PutMapping("/{intId}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(
            @Parameter(description = "认证用户信息") @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "用户文章 ID") @PathVariable("intId") Integer intId,
            @Parameter(description = "已读状态（true=已读，false=未读）") @RequestBody Map<String, Boolean> body) {

        Integer userId = getCurrentUserId(userDetails);
        if (userId == null) {
            log.warn("标记已读失败：未认证用户");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Boolean read = body != null ? body.get("read") : true;
        if (read == null) {
            read = true;
        }

        log.info("标记文章已读/未读：userId={}, intId={}, read={}", userId, intId, read);

        try {
            boolean success = articleService.markAsRead(intId, userId, read);
            if (!success) {
                log.warn("标记已读失败：文章不存在或无权限：userId={}, intId={}", userId, intId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("标记已读失败：userId={}, intId={}, error={}", userId, intId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 标记文章星标/取消星标
     *
     * @param userDetails 认证用户信息
     * @param intId 用户文章 ID
     * @param starred 星标状态（true=星标，false=取消星标）
     * @return 操作结果
     */
    @Operation(summary = "标记文章星标/取消星标", description = "将文章标记为星标或取消星标")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "操作成功"),
        @ApiResponse(responseCode = "401", description = "未认证"),
        @ApiResponse(responseCode = "404", description = "文章不存在")
    })
    @PutMapping("/{intId}/star")
    public ResponseEntity<Map<String, Object>> markAsStarred(
            @Parameter(description = "认证用户信息") @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "用户文章 ID") @PathVariable("intId") Integer intId,
            @Parameter(description = "星标状态（true=星标，false=取消星标）") @RequestBody Map<String, Boolean> body) {

        Integer userId = getCurrentUserId(userDetails);
        if (userId == null) {
            log.warn("标记星标失败：未认证用户");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Boolean starred = body != null ? body.get("starred") : true;
        if (starred == null) {
            starred = true;
        }

        log.info("标记文章星标：userId={}, intId={}, starred={}", userId, intId, starred);

        try {
            boolean success = articleService.markAsStarred(intId, userId, starred);
            if (!success) {
                log.warn("标记星标失败：文章不存在或无权限：userId={}, intId={}", userId, intId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("标记星标失败：userId={}, intId={}, error={}", userId, intId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 批量标记文章已读/未读
     *
     * @param userDetails 认证用户信息
     * @param body 请求体（包含 intIds 列表和 read 状态）
     * @return 成功更新的数量
     */
    @Operation(summary = "批量标记文章已读/未读", description = "批量将多篇文章标记为已读或未读")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "操作成功"),
        @ApiResponse(responseCode = "401", description = "未认证")
    })
    @PutMapping("/read")
    public ResponseEntity<Integer> batchMarkAsRead(
            @Parameter(description = "认证用户信息") @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body) {

        Integer userId = getCurrentUserId(userDetails);
        if (userId == null) {
            log.warn("批量标记已读失败：未认证用户");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        @SuppressWarnings("unchecked")
        List<Integer> intIds = body != null ? (List<Integer>) body.get("intIds") : null;
        Boolean read = body != null ? (Boolean) body.get("read") : true;
        if (read == null) {
            read = true;
        }

        if (intIds == null || intIds.isEmpty()) {
            log.warn("批量标记已读失败：intIds 为空");
            return ResponseEntity.badRequest().build();
        }

        log.info("批量标记文章已读/未读：userId={}, intIds={}, read={}", userId, intIds, read);

        try {
            int count = articleService.batchMarkAsRead(intIds, userId, read);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("批量标记已读失败：userId={}, error={}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 批量标记文章星标/取消星标
     *
     * @param userDetails 认证用户信息
     * @param body 请求体（包含 intIds 列表和 starred 状态）
     * @return 成功更新的数量
     */
    @Operation(summary = "批量标记文章星标/取消星标", description = "批量将多篇文章标记为星标或取消星标")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "操作成功"),
        @ApiResponse(responseCode = "401", description = "未认证")
    })
    @PutMapping("/star")
    public ResponseEntity<Integer> batchMarkAsStarred(
            @Parameter(description = "认证用户信息") @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body) {

        Integer userId = getCurrentUserId(userDetails);
        if (userId == null) {
            log.warn("批量标记星标失败：未认证用户");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        @SuppressWarnings("unchecked")
        List<Integer> intIds = body != null ? (List<Integer>) body.get("intIds") : null;
        Boolean starred = body != null ? (Boolean) body.get("starred") : true;
        if (starred == null) {
            starred = true;
        }

        if (intIds == null || intIds.isEmpty()) {
            log.warn("批量标记星标失败：intIds 为空");
            return ResponseEntity.badRequest().build();
        }

        log.info("批量标记文章星标：userId={}, intIds={}, starred={}", userId, intIds, starred);

        try {
            int count = articleService.batchMarkAsStarred(intIds, userId, starred);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("批量标记星标失败：userId={}, error={}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 搜索文章（全文搜索）
     *
     * @param userDetails 认证用户信息
     * @param query 搜索关键词
     * @param feedId 订阅源 ID（可选）
     * @param categoryId 分类 ID（可选）
     * @param page 页码（从 1 开始，默认 1）
     * @param pageSize 每页大小（默认 20，最大 100）
     * @return 分页文章列表
     */
    @Operation(summary = "搜索文章", description = "根据关键词搜索文章，支持按订阅源和分类筛选")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "搜索成功"),
        @ApiResponse(responseCode = "400", description = "搜索关键词为空"),
        @ApiResponse(responseCode = "401", description = "未认证")
    })
    @GetMapping("/search")
    public ResponseEntity<ArticlePageResponse> searchArticles(
            @Parameter(description = "认证用户信息") @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "搜索关键词", required = true) @RequestParam("query") String query,
            @Parameter(description = "订阅源 ID（可选）") @RequestParam(required = false) Integer feedId,
            @Parameter(description = "分类 ID（可选）") @RequestParam(required = false) Integer categoryId,
            @Parameter(description = "页码（从 1 开始，默认 1）") @RequestParam(required = false, defaultValue = "1") Integer page,
            @Parameter(description = "每页大小（默认 20，最大 100）") @RequestParam(required = false, defaultValue = "20") Integer pageSize) {

        Integer userId = getCurrentUserId(userDetails);
        if (userId == null) {
            log.warn("搜索文章失败：未认证用户");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (query == null || query.trim().isEmpty()) {
            log.warn("搜索文章失败：关键词为空，userId={}", userId);
            return ResponseEntity.badRequest().build();
        }

        log.info("搜索文章：userId={}, keyword={}, feedId={}, categoryId={}, page={}, pageSize={}",
                userId, query, feedId, categoryId, page, pageSize);

        try {
            ArticlePageResponse response = articleService.searchArticles(
                    userId, query.trim(), feedId, categoryId, page, pageSize);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("搜索文章失败：userId={}, keyword={}, error={}", userId, query, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

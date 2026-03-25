#!/bin/bash
# 使用后端编译后的类生成 BCrypt 密码

cd /Users/menmapro/Documents/GitHub/rss/backend

# 创建临时测试文件
cat > /tmp/GenPassword.java << 'JAVAEOF'
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        String password = "admin123";
        String hash = encoder.encode(password);
        System.out.println(hash);
    }
}
JAVAEOF

# 找到 Spring Security Crypto jar
SPRING_JAR=$(find ~/.gradle/caches -name "spring-security-crypto*.jar" | head -1)

# 编译并运行
javac -cp "$SPRING_JAR" /tmp/GenPassword.java
java -cp "/tmp:$SPRING_JAR" GenPassword

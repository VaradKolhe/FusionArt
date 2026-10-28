# ==============================================================================
# FusionArt Backend Multi-Stage Optimized Dockerfile
# Stage 1: Build the Spring Boot application & extract layers
# Stage 2: Minimal hardened JRE runtime with container-aware JVM flags
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Builder
# ------------------------------------------------------------------------------
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /workspace

# Install dos2unix to ensure Windows-edited mvnw scripts run on Linux
RUN apk add --no-cache dos2unix

# 1. Cache Maven Wrapper and POM first to leverage Docker layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN dos2unix mvnw && chmod +x mvnw

# 2. Download dependencies (cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline -B || true

# 3. Copy source files and compile
COPY src/ src/
RUN ./mvnw clean package -DskipTests -B

# 4. Extract Spring Boot layertools for optimized Docker layer caching
RUN java -Djarmode=layertools -jar target/*.jar extract --destination /workspace/extracted

# ------------------------------------------------------------------------------
# Stage 2: Production Minimal Runtime
# ------------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine AS runtime

# Install native dependencies required by Flying Saucer PDF generation and Actuator healthcheck
RUN apk add --no-cache \
    fontconfig \
    ttf-dejavu \
    curl \
    && rm -rf /var/cache/apk/*

# Security: Create non-privileged service user & group
RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

# Prepare writable directories for local uploads and file logs
RUN mkdir -p /app/image /app/logs && chown -R spring:spring /app

# Copy layered application components from builder (ordered from least to most frequently modified)
COPY --from=builder --chown=spring:spring /workspace/extracted/dependencies/ ./
COPY --from=builder --chown=spring:spring /workspace/extracted/spring-boot-loader/ ./
COPY --from=builder --chown=spring:spring /workspace/extracted/snapshot-dependencies/ ./
COPY --from=builder --chown=spring:spring /workspace/extracted/application/ ./

# Switch to non-root user
USER spring:spring

# Expose internal Spring Boot port
EXPOSE 8085

# Optimized JVM flags for low-memory container environments (Render/Koyeb 512MB RAM free tiers)
ENV JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport \
                       -XX:MaxRAMPercentage=75.0 \
                       -XX:InitialRAMPercentage=40.0 \
                       -XX:+UseSerialGC \
                       -XX:+ExitOnOutOfMemoryError \
                       -Djava.security.egd=file:/dev/./urandom \
                       -Dspring.profiles.active=prod"

# Healthcheck using Actuator endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8085/api/actuator/health || exit 1

# Launch using Spring Boot's layer-optimized JarLauncher
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]

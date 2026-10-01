# ===== ETAPE 1 : Build =====
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app

# Copier le pom.xml et telecharger les dependances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source et builder
COPY src ./src
RUN mvn clean package -DskipTests -B

# ===== ETAPE 2 : Runtime =====
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Installer curl pour les health checks
RUN apk add --no-cache curl

# Creer un utilisateur non-root
RUN addgroup -S sunu && adduser -S sunu -G sunu && chown sunu: /app

# Copier le JAR
COPY --from=build /app/target/stock-api-2.0.0.jar app.jar

# Changer d'utilisateur
USER sunu

# Exposer le port
EXPOSE 8081

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD curl -f http://localhost:8081/api/actuator/health || exit 1

# Lancer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
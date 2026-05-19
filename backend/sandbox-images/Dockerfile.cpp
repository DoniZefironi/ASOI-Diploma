FROM gcc:13.2.0

# Ограничиваем доступ к системе (Debian/Ubuntu версии команд)
RUN groupadd -g 1001 sandbox && \
    useradd -u 1001 -g sandbox -m sandbox

USER sandbox

WORKDIR /app
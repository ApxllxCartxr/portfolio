FROM golang:1.25-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /app .

FROM alpine:3.20
RUN apk add --no-cache ca-certificates && adduser -D -H appuser
COPY --from=build /app /app
USER appuser
CMD ["/app"]

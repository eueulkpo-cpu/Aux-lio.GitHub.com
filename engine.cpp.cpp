#include <cmath>
#include <iostream>

struct Vec2 {
    double x, y;
};

class TouchEngine {
public:
    double lastX;
    double lastY;
    double filteredX;
    double filteredY;
    double maxPixels;
    double noiseAlpha;
    Vec2 sensitivity;
    double magnetStrength;
    Vec2 target;

    TouchEngine() {
        lastX = 0;
        lastY = 0;
        filteredX = 0;
        filteredY = 0;
        maxPixels = 120;
        noiseAlpha = 0.25;
        sensitivity = {0.7, 0.45};
        magnetStrength = 0.2;
        // Assuming window.innerWidth and innerHeight are 800x600 for example
        target = {400, 300}; // window.innerWidth/2, window.innerHeight/2
    }

    double bezier(double t) {
        return (
            3 * t * (1 - t) * (1 - t) * 0.25 +
            3 * t * t * (1 - t) * 0.75 +
            t * t * t
        );
    }

    Vec2 filter(double dx, double dy) {
        filteredX += noiseAlpha * (dx - filteredX);
        filteredY += noiseAlpha * (dy - filteredY);
        return {filteredX, filteredY};
    }

    Vec2 pixelLock(double dx, double dy) {
        double dist = std::sqrt(dx * dx + dy * dy);
        if (dist > maxPixels) {
            dx *= 0.3;
            dy *= 0.3;
        }
        return {dx, dy};
    }

    Vec2 magnet(double x, double y) {
        double dx = target.x - x;
        double dy = target.y - y;
        double dist = std::sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            x += dx * magnetStrength;
            y += dy * magnetStrength;
        }
        return {x, y};
    }

    Vec2 process(double dx, double dy) {
        Vec2 filtered = filter(dx, dy);
        Vec2 locked = pixelLock(filtered.x, filtered.y);
        double speed = std::min(
            std::sqrt(locked.x * locked.x + locked.y * locked.y) / 80,
            1.0
        );
        double curve = bezier(speed);
        return {
            locked.x * curve * sensitivity.x,
            locked.y * curve * sensitivity.y
        };
    }
};

// Global instance
TouchEngine engine;
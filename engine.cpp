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
    double currentX;
    double currentY;
    double headRadius;
    bool aimAssist;

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
        currentX = target.x;
        currentY = target.y;
        headRadius = 30;
        aimAssist = true;
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

    Vec2 clampToHead(double x, double y) {
        double dx = x - target.x;
        double dy = y - target.y;
        double dist = std::sqrt(dx * dx + dy * dy);
        if (dist > headRadius) {
            x = target.x + dx / dist * headRadius;
            y = target.y + dy / dist * headRadius;
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
        Vec2 final = {
            locked.x * curve * sensitivity.x,
            locked.y * curve * sensitivity.y
        };
        if (aimAssist) {
            Vec2 proposed = {currentX + final.x, currentY + final.y};
            Vec2 clamped = clampToHead(proposed.x, proposed.y);
            Vec2 actualDelta = {clamped.x - currentX, clamped.y - currentY};
            currentX = clamped.x;
            currentY = clamped.y;
            return actualDelta;
        } else {
            currentX += final.x;
            currentY += final.y;
            return final;
        }
    }
};

// Global instance
TouchEngine engine;

int main() {
    // Test the engine
    Vec2 result = engine.process(10.0, 5.0);
    std::cout << "Processed dx: " << result.x << ", dy: " << result.y << std::endl;
    return 0;
}
    // Enable aim assist
    engine.aimAssist = true;
    result = engine.process(currentX, currentY, 10.0, 5.0);
    std::cout << "With aim assist dx: " << result.x << ", dy: " << result.y << std::endl;
    return 0;
}
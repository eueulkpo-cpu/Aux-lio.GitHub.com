#include <emscripten/bind.h>
#include <cmath>

using namespace emscripten;

class AimEngine {

public:

struct Movement{

float x;
float y;

};

Movement calculate(float dx,float dy,float tx,float ty,float vel){

float dist = sqrt(tx*tx + ty*ty);

float magnet = 0;

if(dist < 80 && dist>0){

magnet = (1 - dist/80) * 0.6;

}

float finalX = (dx*(1-magnet)) + (tx*magnet);
float finalY = (dy*(1-magnet)) + (ty*magnet);

return {finalX,finalY};

}

};

EMSCRIPTEN_BINDINGS(aim_module){

class_<AimEngine>("AimEngine")
.constructor<>()
.function("calculate",&AimEngine::calculate);

value_object<AimEngine::Movement>("Movement")
.field("x",&AimEngine::Movement::x)
.field("y",&AimEngine::Movement::y);

}
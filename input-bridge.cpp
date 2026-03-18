#include <emscripten/bind.h>
#include <cmath>
#include <algorithm>

using namespace emscripten;

class InputProcessor {
private:
    // Configurações de Estado
    float lastDx = 0, lastDy = 0;
    
    // Configurações de Sensibilidade e Suavização
    float baseSensitivity = 1.0f; // Multiplicador base
    float smoothingFactor = 0.20f; // Quanto maior, mais lento/suave (0.0 a 1.0)
    
    // Configurações de Controle de Recuo (Anti-Recoil)
    // Reduz a força de subida vertical 'dy'
    float recoilReductionPower = 0.65f; // Mantém 65% do movimento vertical original
    
    // Configurações de Curva de Resposta
    // Transforma o movimento em uma curva não-linear (estilo "mira assistida" de console)
    float exponent = 1.6f; 

public:
    struct ProcessedInput { float dx, dy; };

    InputProcessor() {}

    // --- Getters e Setters para o JavaScript controlar as configurações em tempo real ---
    void setSensitivity(float s) { baseSensitivity = s; }
    void setSmoothing(float s) { smoothingFactor = std::clamp(s, 0.0f, 0.95f); }
    void setRecoilReduction(float r) { recoilReductionPower = std::clamp(r, 0.0f, 1.0f); }
    void setCurve(float e) { exponent = std::clamp(e, 1.0f, 3.0f); }

    // --- A Mágica: Processamento de Input Nível C++ ---
    ProcessedInput process(float rawDx, float rawDy, float milliseconds) {
        // 1. Aplicação da Curva de Resposta (Bézier Simplificada / Exponencial)
        // Isso ajuda a ter precisão no começo e velocidade no final da puxada.
        float magnitude = std::sqrt(rawDx*rawDx + rawDy*rawDy);
        if (magnitude > 0) {
            float normX = rawDx / magnitude;
            float normY = rawDy / magnitude;
            float newMag = std::pow(magnitude, exponent) * baseSensitivity;
            
            rawDx = normX * newMag;
            rawDy = normY * newMag;
        }

        // 2. Filtro Passa-Baixa (Suavização Samsung Style)
        // Mistura o movimento atual com o anterior para evitar "tremedeira".
        float smoothDx = rawDx * (1.0f - smoothingFactor) + lastDx * smoothingFactor;
        float smoothDy = rawDy * (1.0f - smoothingFactor) + lastDy * smoothingFactor;

        // 3. Controle de Recuo Vertical Nível WASM
        // Se o movimento for predominantemente para cima (dy negativo), reduz a força.
        float finalDx = smoothDx;
        float finalDy = smoothDy;
        
        if (finalDy < 0) {
            // "Prende" um pouco a mira verticalmente para combater a subida da arma
            finalDy *= recoilReductionPower;
        }

        // Atualiza o estado para o próximo frame
        lastDx = finalDx;
        lastDy = finalDy;

        return { finalDx, finalDy };
    }
};

// Vinculação para o WebAssembly
EMSCRIPTEN_BINDINGS(input_module) {
    class_<InputProcessor>("InputProcessor")
        .constructor<>()
        .function("process", &InputProcessor::process)
        .function("setSensitivity", &InputProcessor::setSensitivity)
        .function("setSmoothing", &InputProcessor::setSmoothing)
        .function("setRecoilReduction", &InputProcessor::setRecoilReduction)
        .function("setCurve", &InputProcessor::setCurve);

    value_object<InputProcessor::ProcessedInput>("ProcessedInput")
        .field("dx", &InputProcessor::ProcessedInput::dx)
        .field("dy", &InputProcessor::ProcessedInput::dy);
}
Enviado há 4 min
Escrever para Claudinéia Dias

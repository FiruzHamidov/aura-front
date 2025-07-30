'use client';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
  className?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  steps = [],
  className = '',
}: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-[#0036A5] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const stepLabel = steps[index] || `Step ${stepNumber}`;

          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm  border-2 transition-all duration-200 ${
                  isCompleted
                    ? 'bg-[#0036A5] border-[#0036A5] text-white'
                    : isActive
                    ? 'bg-white border-[#0036A5] text-[#0036A5]'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span
                className={`text-xs mt-2 text-center ${
                  isActive
                    ? 'text-[#0036A5] '
                    : isCompleted
                    ? 'text-gray-700'
                    : 'text-gray-400'
                }`}
              >
                {stepLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Step Text */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">
          Шаг {currentStep} из {totalSteps}
        </span>
      </div>
    </div>
  );
}

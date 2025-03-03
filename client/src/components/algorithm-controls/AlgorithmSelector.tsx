import React, { useEffect, useState } from 'react';
import { AlgorithmType, AlgorithmInfo } from '@/types';
import { getAlgorithms } from '@/services/algorithms';
import { algorithmColors } from '@/utils/colors';

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType;
  onSelectAlgorithm: (algorithm: AlgorithmType) => void;
  disabled?: boolean;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onSelectAlgorithm,
  disabled = false
}) => {
  const [algorithms, setAlgorithms] = useState<AlgorithmInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available algorithms
  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        setLoading(true);
        const data = await getAlgorithms();
        setAlgorithms(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching algorithms:', err);
        setError('Failed to load algorithms');
        // Use fallback algorithms
        setAlgorithms([
          {
            id: 'astar',
            name: 'A* Algorithm',
            description: 'A widely used pathfinding algorithm that uses heuristics to find the shortest path.',
            complexityTime: 'O(E log V)',
            complexitySpace: 'O(V)',
            color: algorithmColors.astar
          },
          {
            id: 'jps',
            name: 'Jump Point Search',
            description: 'An optimization of A* for uniform-cost grids that can dramatically reduce computation time.',
            complexityTime: 'O(E log V)',
            complexitySpace: 'O(V)',
            color: algorithmColors.jps
          },
          {
            id: 'bts',
            name: 'Bidirectional Theta*',
            description: 'A bidirectional version of Theta* that searches from both start and end simultaneously.',
            complexityTime: 'O(E log V)',
            complexitySpace: 'O(V)',
            color: algorithmColors.bts
          },
          {
            id: 'flowfield',
            name: 'Flow Field Pathfinding',
            description: 'Creates a vector field to guide multiple agents to a destination efficiently.',
            complexityTime: 'O(V)',
            complexitySpace: 'O(V)',
            color: algorithmColors.flowfield
          },
          {
            id: 'hpa',
            name: 'Hierarchical Pathfinding A*',
            description: 'A multi-level pathfinding approach that abstracts the map into a hierarchy for faster searches.',
            complexityTime: 'O(E log V)',
            complexitySpace: 'O(V + A)',
            color: algorithmColors.hpa
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlgorithms();
  }, []);

  const handleSelectAlgorithm = (algorithm: AlgorithmType) => {
    if (!disabled) {
      onSelectAlgorithm(algorithm);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Select Algorithm</h3>
      
      {loading ? (
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading algorithms...</span>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {algorithms.map((algorithm) => (
            <div
              key={algorithm.id}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${selectedAlgorithm === algorithm.id 
                  ? `border-${algorithm.id}-600 bg-${algorithm.id}-50` 
                  : 'border-gray-200 hover:border-gray-300'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              style={{
                borderColor: selectedAlgorithm === algorithm.id ? algorithm.color : undefined,
                backgroundColor: selectedAlgorithm === algorithm.id ? `${algorithm.color}15` : undefined
              }}
              onClick={() => handleSelectAlgorithm(algorithm.id as AlgorithmType)}
            >
              <h4 className="font-medium">{algorithm.name}</h4>
              <div className="mt-1 text-xs text-gray-500">Time: {algorithm.complexityTime}</div>
              <div className="text-xs text-gray-500">Space: {algorithm.complexitySpace}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlgorithmSelector;
import usePrevious from './usePrevious';
import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Old code before rule was applied
export default function useEffectDebugger(effectHook: any, dependencies: any, dependencyNames: any[] = []) {
	const previousDeps = usePrevious(dependencies, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Old code before rule was applied
	const changedDeps = dependencies.reduce((accum: any, dependency: any, index: any) => {
		if (dependency !== previousDeps[index]) {
			const keyName = dependencyNames[index] || index;
			return {
				...accum,
				[keyName]: {
					before: previousDeps[index],
					after: dependency,
				},
			};
		}

		return accum;
	}, {});

	if (Object.keys(changedDeps).length) {
		// eslint-disable-next-line no-console
		console.log('[use-effet-debugger] ', changedDeps);
	}

	// eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
	useEffect(effectHook, dependencies);
}

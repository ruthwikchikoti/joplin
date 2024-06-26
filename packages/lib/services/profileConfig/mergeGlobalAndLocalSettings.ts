import Logger from '@joplin/utils/Logger';
import Setting from '../../models/Setting';

const logger = Logger.create('mergeGlobalAndLocalSettings');

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Old code before rule was applied
export default (rootSettings: Record<string, any>, subProfileSettings: Record<string, any>) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Old code before rule was applied
	const output: Record<string, any> = { ...subProfileSettings };

	for (const k of Object.keys(output)) {
		try {
			const md = Setting.settingMetadata(k);
			if (md.isGlobal) {
				delete output[k];
				if (k in rootSettings) output[k] = rootSettings[k];
			}
		} catch (error) {
			if (error.code === 'unknown_key') {
				// The root settings may contain plugin parameters, but the
				// sub-profile won't necessarily have these plugins. In that
				// case, the app will throw an error, but we can ignore it since
				// we don't need this particular setting.
				// https://github.com/laurent22/joplin/issues/8143
				logger.info(`Ignoring unknown key in root settings: ${k}`);
			}
		}
	}

	for (const k of Object.keys(rootSettings)) {
		// We only copy built-in key and not, for example, plugin keys, because
		// those are plugin-specific
		if (!Setting.isBuiltinKey(k)) {
			logger.info(`Skipping non-built-in key: ${k}`);
			continue;
		}

		try {
			const md = Setting.settingMetadata(k);
			if (md.isGlobal) {
				output[k] = rootSettings[k];
			}
		} catch (error) {
			if (error.code === 'unknown_key') {
				// The root settings may contain plugin parameters, but the
				// sub-profile won't necessarily have these plugins. In that
				// case, the app will throw an error, but we can ignore it since
				// we don't need this particular setting.
				// https://github.com/laurent22/joplin/issues/8143
				logger.info(`Ignoring unknown key in root settings: ${k}`);
			}
		}
	}

	return output;
};

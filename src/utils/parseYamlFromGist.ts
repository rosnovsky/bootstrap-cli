import axios from 'axios';
import yaml from 'yaml';
import { logError } from './logger.js';

export async function fetchYamlFromGist(inputUrl) {
  try {
    let rawUrl;
    if (/^(https:\/\/gist\.githubusercontent\.com\/)/.test(inputUrl)) {
      rawUrl = inputUrl;
    } else {
      const gistIdMatch = inputUrl.match(/^(https:\/\/gist\.github\.com\/[^\/]+\/)?([0-9a-fA-F]+)$/);
      if (gistIdMatch) {
        rawUrl = `https://gist.githubusercontent.com/${gistIdMatch[2]}/raw`;
      } else {
        throw new Error(`This does not appear to be a valid Gist URL: ${inputUrl}`);
      }
    }
    const response = await axios.get(rawUrl);
    if (response.status === 200) {
      return yaml.parse(response.data);
    } else {
      throw new Error(`Error fetching YAML from Gist; received status code: ${response.status}`);
    }
  } catch (error) {
    logError('Error fetching or parsing YAML from Gist', error);
    throw error;
  }
}

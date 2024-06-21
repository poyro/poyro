import constants from "../../constants.json";

/**
 * This function gets the URL for the model.
 *
 * @returns The URL for the model
 */
export const getModelUrl = (): string => {
  const filename = constants.model.filename;
  return `https://huggingface.co/${constants.model.org}/${constants.model.repo}/resolve/main/${filename}?download=true`;
};

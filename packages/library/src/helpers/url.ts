import axios from "axios"

export const getFileContents = async (url: string): Promise<string> => {
  const response = await axios.get(url)
  return response.data
}
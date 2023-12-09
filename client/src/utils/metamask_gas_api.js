const axios = require("axios");
const {Buffer} = require('buffer');
// require("dotenv").config();

const Auth = Buffer.from(
    process.env.INFURA_API_KEY + ":" + process.env.INFURA_API_KEY_SECRET,
  ).toString("base64");
  

// The chain ID of the supported network
const chainId = 11155111n;

export const estimateGasFee = async (chainId) => {
  try {
    console.log("axios", axios)
    const { data } = await axios.get(
      `https://gas.api.infura.io/networks/${chainId}/suggestedGasFees`,
      {
        headers: {
          Authorization: `Basic ${Auth}`,
        },
      },
    );
    console.log("Suggested gas fees:", data);
    return data;
  } catch (error) {
    console.log("Server responded with:", error);
    return null;
  }
};
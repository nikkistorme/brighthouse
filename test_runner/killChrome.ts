const killChrome = async (chrome: Chrome) => {
  console.log('🚀 ~ chrome:', chrome);
  try {
    await chrome.kill();
  }
  catch (err) {
    throw err;
  }
}

export default killChrome;
type FrameEmbed = {
  version: "next";
  imageUrl: string;
  button: {
    title: string;
    action: {
      type: "launch_frame";
      name: string;
      url: string;
      splashImageUrl: string;
      splashBackgroundColor: string;
    };
  };
};

async function writeMetadata(data: FrameEmbed) {
  try {
    const jsonString = JSON.stringify(data).replace(/"/g, "&quot;");
    console.log(jsonString);
  } catch (error) {
    console.error("Error writing metadata:", error);
  }
}

const frameData: FrameEmbed = {
  version: "next",
  imageUrl:
    "https://github.com/jpfraneto/images/blob/main/farbarter.png?raw=true",
  button: {
    title: "Shop Now",
    action: {
      type: "launch_frame",
      name: "Farbarter",
      url: "https://farbarter.com",
      splashImageUrl: "https://farbarter.com/splash.jpeg",
      splashBackgroundColor: "#4D8C97",
    },
  },
};

writeMetadata(frameData);

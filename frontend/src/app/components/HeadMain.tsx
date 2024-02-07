import React from "react";

// Define the prop types for the component
type Props = {
  title: string;
  description: string;
};

// HeadMain component to set the title and meta description of the page
const HeadMain = (props: Props) => {
  return (
    <>
      {/* Set the title of the page */}
      <title>{props.title}</title>

      {/* Set the meta description of the page */}
      <meta name="description" content={props.description} />
    </>
  );
};

export default HeadMain;

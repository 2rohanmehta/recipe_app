import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
function RecipePreviewBox(props) {
  let navigate = useNavigate();
  const [authorName, setAuthorName] = useState("Unknown Author");
  const onClickHandler = () => {
    navigate(`/view-recipe/${props.id}`);
  };

  useEffect(() => {
    fetchAuthor();
  });
  const fetchAuthor = async () => {
    try {
      const authorData = await props.fetchAuthorName(props.id);
      //console.log(authorData);

      if (
        typeof authorData === "object" &&
        authorData !== null &&
        authorData.hasOwnProperty("Name")
      ) {
        setAuthorName(authorData.Name);
      } else {
        setAuthorName("Unknown Author");
      }
    } catch (error) {
      console.error("Error fetching author name:", error);
      setAuthorName("whose user page?");
    }
  };

  return (
    <div>
      <div
        className="border border-b rounded-md m-3 shadow-md hover:shadow-lg bg-slate-50 transition-transform duration-300 transform hover:scale-105 flex flex-col justify-between"
        style={{
          width: "275px",
          height: "275px",
          overflow: "hidden",
          zIndex: 1000,
        }}
        onClick={onClickHandler}
      >
        <img
          className="w-full object-cover"
          style={{ height: "205px" }}
          src={props.image !== "null" ? props.image : "/allfoodimg.jpg"}
          alt={props.title}
        />
        <div
          className="text-center  text-md md:text-lg p-1 overflow-hidden"
          style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {props.title}
        </div>

        <div
          className="text-center text-sm md:text-md p-1"
          style={{ minHeight: "35px" }}
        >
          By: {authorName}
        </div>
      </div>
    </div>
  );
}

export default RecipePreviewBox;

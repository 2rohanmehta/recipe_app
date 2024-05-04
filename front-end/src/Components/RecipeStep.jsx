import React from "react";

export default function Step({
  newStep,
  handleChange,
  handleSubmit,
  handleImageChange,
  imageUploaded,
}) {
  return (
    <form onSubmit={handleSubmit} className="step-form">
      <input
        name="title"
        placeholder="New Step"
        value={newStep.title || ""}
        onChange={handleChange}
      />
      {!newStep.title ? null : (
        <>
          <textarea
            name="description"
            placeholder="Details..."
            value={newStep.description || ""}
            onChange={handleChange}
          />
          <button type="submit">Add Step</button>
        </>
      )}
    </form>
  );
}

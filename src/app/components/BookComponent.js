/* @/app/components/BookComponent.css */

// Style (CSS)
import "@/styles/components/bookcomponent.css";

export default function BookComponent({ book, coreTags }) {
  return (
    <div className="book-item">
      <div className="book-cover">
        <a href={book.content} target="_blank">
          <img src={book.cover} alt="Book Cover" className="cover-image" />
        </a>
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <div className="book-tags">
          {book.mainTags.map((tag) => {
            const tagData = coreTags.find((t) => t.name === tag);
            return tagData ? (
              <span
                key={tag}
                className="main-tag"
                style={{ backgroundColor: tagData.bgColor, color: tagData.textColor }}
              >
                <img src={tagData.icon} alt={tag} className="tag-icon" />
                {tag}
              </span>
            ) : null;
          })}
          {book.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
  
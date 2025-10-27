"use client";
import css from "./Footer.module.css";
export const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Hladkova Marharyta</p>
          <p>
            Contact us:
            <a href="mailto:margarita198700@gmail.com">
              margarita198700@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

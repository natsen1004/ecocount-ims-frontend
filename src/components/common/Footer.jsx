import '../../styles/Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        &copy; {new Date().getFullYear()} EcoCount IMS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

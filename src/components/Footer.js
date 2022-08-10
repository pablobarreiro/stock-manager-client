import logo from "../images/shootLogo.png"

const Footer = () => {
  return (
    <div style={{backgroundColor: '#cccccc',display:"flex", justifyContent:'center'}}>
      <img style={{maxWidth:"300px",margin:'10px'}} src={logo} />
    </div>
  );
};

export default Footer;

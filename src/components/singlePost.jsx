import { Card } from "react-bootstrap";

const SinglePost = ({ image, title, text, userName }) => {
    return (
        <Card>
            <Card.Img
                variant="top"
                src={image}
                width={20}
                height={250}
            />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    {text}
                </Card.Text>
                <a href="#" className="btn btn-success">{userName}</a>
            </Card.Body>
        </Card>
    );
};

export default SinglePost;
'use client';
import { Button, Col, Form, Row } from 'antd';

const ButtonSubmit = ({ children, loader }: any) => {
    return (
        <Row>
            <Col span={24} md={{ span: 6, offset: 9 }}>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loader}>
                        <b>{children}</b>
                    </Button>
                </Form.Item>
            </Col>
        </Row>
    );
};

export default ButtonSubmit;

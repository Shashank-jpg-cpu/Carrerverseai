import { useEffect, useState } from "react";

import api from "../../services/api";

function Notifications() {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {

        loadNotifications();

    }, []);

    const loadNotifications = async () => {

        try {

            const response = await api.get(

                "/notification/student/1"

            );

            setNotifications(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container mt-5">

            <h2>

                Notifications

            </h2>

            {

                notifications.length === 0 ?

                (

                    <div className="alert alert-info">

                        No Notifications Available

                    </div>

                )

                :

                (

                    notifications.map(notification => (

                        <div

                            key={notification.id}

                            className="card mb-3 shadow"

                        >

                            <div className="card-body">

                                <h5>

                                    {notification.title}

                                </h5>

                                <p>

                                    {notification.message}

                                </p>

                                <small>

                                    {notification.created_at}

                                </small>

                            </div>

                        </div>

                    ))

                )

            }

        </div>

    );

}

export default Notifications;
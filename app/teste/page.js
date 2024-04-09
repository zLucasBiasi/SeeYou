// No lado do cliente (React component)
'use client'
import { useEffect, useState } from 'react';

const IndexPage = () => {
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [postcode, setPostcode] = useState("");
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const requestMediaPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                console.log('Permissão concedida para acessar a câmera', stream);

                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                video.onloadedmetadata = async () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const photo = canvas.toDataURL('image/png');
                    setImageData(photo);

                    // Obter a localização geográfica
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(async (position) => {
                            console.log('Localização geográfica:', position.coords.latitude, position.coords.longitude);

                            const { latitude, longitude } = position.coords;
                            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                            const data = await response.json();
                            setState(data.address.state);
                            setCity(data.address.city);
                            setCountry(data.address.country);
                            setPostcode(data.address.postcode);

                            // Enviar a imagem e os dados de localização para o servidor
                            fetch('/save-image', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    image: photo,
                                    location: {
                                        state: data.address.state,
                                        city: data.address.city,
                                        country: data.address.country,
                                        postcode: data.address.postcode,
                                    },
                                }),
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Erro ao enviar a imagem para o servidor');
                                }
                                console.log('Imagem e dados de localização enviados com sucesso para o servidor');
                            })
                            .catch(error => {
                                console.error('Erro ao enviar a imagem para o servidor:', error);
                            });
                        }, (error) => {
                            console.error('Erro ao obter a localização geográfica:', error);
                        });
                    } else {
                        console.error('Geolocalização não é suportada neste navegador.');
                    }
                };
            } catch (error) {
                console.error('Erro ao solicitar permissão de acesso à câmera:', error);
            }
        };

        requestMediaPermission();

        return () => {
            // Limpar os recursos quando o componente for desmontado
        };
    }, []);

    return (
        <div>
            <h1>Permissão de Acesso à Câmera</h1>
            <h2>{state}</h2>
            <h2>{country}</h2>
            <h2>{city}</h2>
            <h2>{postcode}</h2>
            {imageData && <img src={imageData} alt="Webcam Captured" />}
        </div>
    );
};

export default IndexPage;

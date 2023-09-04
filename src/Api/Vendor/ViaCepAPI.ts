import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ViaCepInfo } from "types/vendor/ViaCep/ViaCepInfo";

export class ViaCepAPI {
    private viaCepUrl = 'http://viacep.com.br/ws';

    public useViaCep = (cep: string | undefined) => useQuery<ViaCepInfo>(
        ['viaCep', cep],
        async () => {
            const response = await axios.get(
                `${this.viaCepUrl}/${cep}/json`
            );
            return response.data;
        },
        {
            enabled: !!cep && cep.length >= 8
        }
    )
}
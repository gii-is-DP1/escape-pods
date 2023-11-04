import {
    Table
    } from "reactstrap";
    import tokenService from "../services/token.service";
    import useFetchState from "../util/useFetchState";
    const imgnotfound = "https://cdn-icons-png.flaticon.com/512/5778/5778223.png";
    const jwt = tokenService.getLocalAccessToken();
    export default function AchievementList() {
    const [achievements, setAchievements] = useFetchState(
    [],
    `/api/v1/achievements`,
    jwt
    );
    const achievementList =
    achievements.map((a) => {
    return (<tr key={a.id}>
        <td className="text-center">{a.name}</td>
        <td className="text-center"> {a.description} </td>
        <td className="text-center">
        <img src={a.badgeImage ? a.badgeImage : imgnotfound } alt={a.name} width="50px"/>
        </td>
        <td className="text-center"> {a.threshold} </td>
        <td className="text-center"> {a.metric} </td>
        <td className="text-center"> --- </td>
        </tr>
        );
        });
        return (
        <div>
        <div className="admin-page-container">
        <h1 className="text-center">Achievements</h1>
        <div>
        <Table aria-label="achievements" className="mt-4">
        <thead>
        <tr>
        <th className="text-center">Name</th>
        <th className="text-center">Description</th>
        <th className="text-center">Image</th>
        <th className="text-center">Threshold</th>
        <th className="text-center">Metric</th>
        <th className="text-center">Actions</th>
        </tr>
        </thead>
        <tbody>{achievementList}</tbody>
        </Table>
        </div>
        </div>
        </div>
        );
        }
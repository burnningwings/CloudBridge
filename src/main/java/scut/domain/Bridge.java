package scut.domain;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "bridge_info")
public class Bridge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bridge_id")
    private long id;

    @Column(name = "bridge_number")
    private String number;

    private Date createTime;

    private String description;

    @Column(name = "bridge_name")
    private String name;

    private Date lastUpdate;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "bridge_organization",
            joinColumns = @JoinColumn(
                    name = "bridge_id",
                    referencedColumnName = "bridge_id",
                    foreignKey = @ForeignKey(name = "fk_bridge_id")),
            inverseJoinColumns = @JoinColumn(
                    name = "organization_id",
                    referencedColumnName = "id",
                    foreignKey = @ForeignKey(name = "fk_organization_id")))
    private Set<Organization> organizationsThatCanManageThisBridge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "direct_organization_id",
            referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "fk_bridge_info_direct_organization_id"))
    private Organization directOrganization;

    @OneToMany(mappedBy = "bridge")
    private Set<Section> sections;

    @OneToMany(mappedBy = "bridge")
    private Set<WatchBox> watchBoxes;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(Date lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    public Set<Organization> getOrganizationsThatCanManageThisBridge() {
        return organizationsThatCanManageThisBridge;
    }

    public void setOrganizationsThatCanManageThisBridge(Set<Organization> organizationsThatCanManageThisBridge) {
        this.organizationsThatCanManageThisBridge = organizationsThatCanManageThisBridge;
    }

    public Set<Section> getSections() {
        return sections;
    }

    public void setSections(Set<Section> sections) {
        this.sections = sections;
    }

    public Set<WatchBox> getWatchBoxes() {
        return watchBoxes;
    }

    public void setWatchBoxes(Set<WatchBox> watchBoxes) {
        this.watchBoxes = watchBoxes;
    }

    public Organization getDirectOrganization() {
        return directOrganization;
    }

    public void setDirectOrganization(Organization directOrganization) {
        this.directOrganization = directOrganization;
    }
}
